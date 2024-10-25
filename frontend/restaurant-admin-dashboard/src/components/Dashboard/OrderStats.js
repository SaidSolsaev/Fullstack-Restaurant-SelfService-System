import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaMoneyBillAlt } from 'react-icons/fa';

const StatsWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 20px 0;

    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const StatCard = styled.div`
    background-color: ${({ $bgColor }) => $bgColor || '#FFF'};
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    color: #333;

    h3 {
        margin-bottom: 10px;
        font-size: 1.1rem;
        color: #333;
    }

    p {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 5px;
        color: #333;
    }

    .difference {
        font-size: .9rem;
        color: ${({ $difference, theme }) => $difference > 0 ? theme.success : theme.error};
    }

    .icon-wrapper {
        position: absolute;
        top: 5px;
        left: 10px;
        font-size: 1.5rem;
        opacity: 0.5;
    }
`;

const OrderStats = () => {
    const { orders } = useSelector((state) => state.orders);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const { totalOrdersThisMonth, totalOrdersLastMonth, avgIncomePerOrder, totalIncomeThisMonth, totalIncomeLastMonth, incomeDifference } = useMemo(() => {
        let totalOrdersThisMonth = 0;
        let totalOrdersLastMonth = 0;
        let totalOrdersAllTime = 0;
        let totalIncomeThisMonth = 0;
        let totalIncomeLastMonth = 0;

        orders.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            const orderMonth = orderDate.getMonth();
            const orderYear = orderDate.getFullYear();

            if (['delivered', 'done'].includes(order.status)) {
                totalOrdersAllTime += 1;

                if (orderMonth === currentMonth && orderYear === currentYear) {
                    totalOrdersThisMonth += 1;
                    totalIncomeThisMonth += parseFloat(order.totalAmount);
                }

                if (orderMonth === currentMonth - 1 && orderYear === currentYear) {
                    totalOrdersLastMonth += 1;
                    totalIncomeLastMonth += parseFloat(order.totalAmount);
                }
            }
        });

        const avgIncomePerOrder = totalOrdersThisMonth > 0 ? (totalIncomeThisMonth / totalOrdersThisMonth).toFixed(2) : 0;
        const incomeDifference = ((totalIncomeThisMonth - totalIncomeLastMonth) / (totalIncomeLastMonth || 1) * 100).toFixed(2);

        return {
            totalOrdersThisMonth,
            totalOrdersLastMonth,
            totalOrdersAllTime,
            avgIncomePerOrder,
            totalIncomeThisMonth,
            totalIncomeLastMonth,
            incomeDifference: isNaN(incomeDifference) ? 0 : incomeDifference,
        };
    }, [orders, currentMonth, currentYear]);

    return (
        <div>
            <h2>This Month's delivered orders</h2>

            <StatsWrapper>
                <StatCard $bgColor="#fce8e8" $difference={totalOrdersThisMonth - totalOrdersLastMonth}>
                    <div className="icon-wrapper">
                        <FaMoneyBillAlt />
                    </div>
                    <h3>Total Orders</h3>
                    <p>{totalOrdersThisMonth}</p>
                    <p className="difference" >
                        {totalOrdersThisMonth > totalOrdersLastMonth
                            ? `+${((totalOrdersThisMonth - totalOrdersLastMonth) / (totalOrdersLastMonth || 1).toFixed(2) * 100).toFixed(2)}%`
                            : `-${((totalOrdersThisMonth - totalOrdersLastMonth) / (totalOrdersLastMonth || 1).toFixed(2) * 100).toFixed(2)}%`
                            } from last month
                    </p>
                </StatCard>

                <StatCard $bgColor="#e0f7fa" $difference={avgIncomePerOrder}>
                    <div className="icon-wrapper">
                        <FaMoneyBillAlt />
                    </div>
                    <h3>Average Income per Order</h3>
                    <p>${avgIncomePerOrder}</p>
                    <p className="difference">
                        {totalIncomeThisMonth > totalIncomeLastMonth
                            ? `+${((avgIncomePerOrder - (totalIncomeLastMonth / totalOrdersLastMonth || 1)).toFixed(2) / avgIncomePerOrder * 100).toFixed(2)}%`
                            : `${((avgIncomePerOrder - (totalIncomeLastMonth / totalOrdersLastMonth || 1)).toFixed(2) / avgIncomePerOrder * 100).toFixed(2)}%`}
                    </p>
                </StatCard>

                <StatCard $bgColor="#e8f5e9" $difference={incomeDifference}>
                    <div className="icon-wrapper">
                        <FaMoneyBillAlt />
                    </div>
                    <h3>Total Revenue</h3>
                    <p>${totalIncomeThisMonth.toFixed(2)}</p>
                    <p className="difference" >
                        {incomeDifference > 0 ? `+${incomeDifference}%` : `-${incomeDifference}%`}
                    </p>
                </StatCard>

                
            </StatsWrapper>
        </div>
    )
}

export default OrderStats