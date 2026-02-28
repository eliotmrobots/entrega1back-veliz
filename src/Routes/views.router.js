import express from "express"

const createViewsRouter = (productManager) => {
    const viewsRouter = express.Router();

    viewsRouter.get("/", async (req, res) => {
        const products = await productManager.getProducts();
        res.render('home', {products});
    });

    viewsRouter.get("/realtimeproducts", async (req, res) => {
        const products = await productManager.getProducts();
        res.render("realTimeProducts", {products});
    });

    return viewsRouter;
};


export default createViewsRouter;
