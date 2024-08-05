-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "nome_cliente" TEXT NOT NULL,
    "prod_comp" TEXT NOT NULL,
    "valot_total" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);
