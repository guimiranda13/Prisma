import { Router } from "express";
import { CreateProductController } from "./controllers/CreateProductController";
import { CreateCategoryController } from "./controllers/CreateCategoryController";
import { CreateRelacionamentoController } from "./controllers/CreateRelacionamentoController";
import { CreateCartController } from "./controllers/CreateCartController";


const router = Router();

const createProduct = new CreateProductController();
const createCategory = new CreateCategoryController();
const createRelacionamento = new CreateRelacionamentoController();
const createCart = new CreateCartController();

router.post("/product", createProduct.create);
router.post("/category", createCategory.create);
router.post("/relacionamento", createRelacionamento.create);
router.get("/product/:id", createProduct.getById);
router.delete("/product/:id", createProduct.deleteproduct);
router.patch("/product/:id",createProduct.updateProduct);
router.post("/cart", createCart.create);
router.get("/cart/:id", createCart.buscar);
router.delete("/cart/:cartid/items/:itemid", createCart.deleteItem)

export{router}