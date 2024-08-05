import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { Prisma } from '@prisma/client';

export class CreateCartController {
    async create(req: Request, res: Response) {
        const { nome_cliente, items } = req.body;

        // Verifique se a lista de itens está vazia
        if (!items || items.length === 0) {
            return res.status(400).json({
                error: 'A requisição deve conter pelo menos um produto.',
            });
        }

        // Verifique se todos os produtos existem
        const productIds = items.map((item: { productId: string }) => item.productId);
        const produtosExistentes = await prismaClient.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
        });

        const produtosExistentesIds = produtosExistentes.map(prod => prod.id);

        const produtosNaoEncontrados = productIds.filter((id: string) => !produtosExistentesIds.includes(id));

        if (produtosNaoEncontrados.length > 0) {
            return res.status(404).json({
                error: `Os seguintes produtos não foram encontrados: ${produtosNaoEncontrados.join(', ')}`,
            });
        }

        const valorTotal = produtosExistentes.reduce(
            (previousvalue, currentvalue) => {
                const valoritem = new Prisma.Decimal(currentvalue.price).toNumber()
                const item = items?.find((_item: any) => _item.productId === currentvalue.id)
                return previousvalue + valoritem * item.quantity
            }, 0)

        // Crie um novo carrinho
        const newCart = await prismaClient.cart.create({
            data: {
                nome_cliente,
                valor_total: valorTotal,
                items: {
                    create: items.map((item: { productId: string; quantity: number }) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
        });

        return res.status(201).json(newCart);
    }

    async buscar(req: Request, res: Response) {
        const { id } = req.params;

        const cart = await prismaClient.cart.findUnique({
            where: {
                id: id,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ error: 'Carrinho não encontrado.' });
        }
    }



    async deleteItem(request: Request, response: Response) {
        const { cartid, itemid } = request.params;

        const cartItem = await prismaClient.cartItem.findUnique({
            where: {
                cartId_productId:{
                    cartId:cartid,
                    productId:itemid
                }
            },
        });

        if (!cartItem) {
            return response.status(404).json({
                error: 'Item não encontrado no carrinho.',
            });
        }

        await prismaClient.cartItem.delete({
            where: {
                id: cartItem.id
            },
        });

        return response.status(200).json({
            message: 'Item excluído com sucesso.',
        });
    }



}

