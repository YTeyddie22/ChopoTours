//! The catch method. This will help remove the try catch block when using asynchronous javascript

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
