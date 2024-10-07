import { findNodeHandle } from 'react-native';

const ScrollHelper = {
    scrollToCategory: (scrollRef, categoryId) => {
        const node = findNodeHandle(document.getElementById(categoryId));
        scrollRef.current.scrollTo({ y: node.offsetTop, animated: true});
    }
};

export default ScrollHelper;
