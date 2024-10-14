import jsPDF from "jspdf";
import "jspdf-autotable";
import { Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const generatePDF = async (orderDetails) => {

    if (Platform.OS === 'web'){

        const doc = new jsPDF();
    
        doc.setFontSize(18);
        doc.text(`Invoice #${orderDetails.orderNumber}`, 105, 10, { align: "center" });
    
        doc.setFontSize(12);
        doc.text("Burger Place", 10, 20);
        doc.text("123 Main St, Anytown", 10, 25);
        doc.text("Phone: +1 (555) 555-5555", 10, 30);
    
        doc.text(`Order Number: ${orderDetails.orderNumber}`, 10, 40);
        doc.text(`Phone Number: +${orderDetails.phoneNumber}`, 10, 45);
        doc.text(`Date: ${new Date(orderDetails.createdAt).toLocaleDateString()}`, 10, 50);
    
        const columns = ["Item", "Quantity", "Add-Ons", "Price"];
        const rows = [];
    
        orderDetails.orderItems.forEach(item => {
            const addOns = item.addOns.length > 0 ? item.addOns.map(a => a.name).join(", ") : "None";
            rows.push([item.MenuItem.name, item.quantity, addOns, `$${item.MenuItem.price}`]);
        });
    
        doc.autoTable({
            head: [columns],
            body: rows,
            startY: 60,
        });
    
        doc.text(`Total Amount: $${orderDetails.totalAmount}`, 10, doc.lastAutoTable.finalY + 10);
    
        doc.save(`Invoice_${orderDetails.orderNumber}.pdf`);
    } else {
        const htmlContent = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            margin: 0;
                            color: #333;
                        }
                        h1 {
                            color: #2c3e50;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        p {
                            font-size: 14px;
                            line-height: 1.6;
                            margin: 5px 0;
                        }
                        h2 {
                            color: #34495e;
                            font-size: 18px;
                            margin-top: 20px;
                            border-bottom: 1px solid #ccc;
                            padding-bottom: 5px;
                        }
                        ul {
                            list-style-type: none;
                            padding: 0;
                            margin: 0;
                        }
                        li {
                            font-size: 14px;
                            line-height: 1.6;
                            border-bottom: 1px solid #ddd;
                            padding: 10px 0;
                        }
                        .item-name {
                            font-weight: bold;
                        }
                        .add-ons {
                            font-size: 12px;
                            color: #888;
                        }
                        .total {
                            font-size: 16px;
                            font-weight: bold;
                            margin-top: 20px;
                        }
                    </style>
                </head>


               <body>
                    <h1>Order Receipt</h1>
                    <p>Order Number: ${orderDetails.orderNumber}</p>
                    <p>Phone Number: ${orderDetails.phoneNumber}</p>
                    <p>Total Amount: $${orderDetails.totalAmount}</p>

                    <h2>Items</h2>
                    <ul>
                        ${orderDetails.orderItems.map(item => `
                            <li>
                                <span class="item-name">${item.MenuItem.name} - ${item.quantity}x</span>
                                ${item.addOns.length > 0 ? `<br><span class="add-ons">Add-ons: ${item.addOns.map(a => a.name).join(', ')}</span>` : ''}
                            </li>
                        `).join('')}
                    </ul>

                    <p class="total">Total Amount: $${orderDetails.totalAmount}</p>
                </body>
            </html>
        `;

        const {uri} = await Print.printToFileAsync({html: htmlContent});
        
        await Sharing.shareAsync(uri);
    }
};