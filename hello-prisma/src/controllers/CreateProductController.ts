import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

export class CreateProductController {
    async create(request: Request, response: Response) {
        const { name, bar_code, price } = request.body;

        const existingProduct = await prismaClient.product.findUnique({
            where: { bar_code },
        });

        if (existingProduct) {
            return response.status(400).json({
                error: 'Produto com este código de barras já existe.',
            });
        }
        
        const product = await prismaClient.product.create({
            data: {
                name,
                bar_code,
                price,
            }
        });

        return response.status(201).json({
            product,
        });
    }

    async getById(request: Request, response: Response) {
        const { id } = request.params;
        console.log(id)
        const product = await prismaClient.product.findUnique({
            where: { id },
        });

        if (!product) {
            return response.status(404).json({
                error: 'Produto não encontrado.',
            });
        }

        return response.status(200).json({
            product,
        });
    }

    async deleteproduct(request: Request, response: Response) {
        const { id } = request.params;
        const product = await prismaClient.product.findUnique({
            where: { id },
        });

        if (!product) {
            return response.status(404).json({
                error: 'Produto não encontrado.',
            });
        }
        await prismaClient.product.delete({
            where: { id },
        });

        return response.status(200).json({
            message:'Produto deletado',
        });
    }

    async updateProduct(request: Request, response: Response) {
        const { id } = request.params;
        const updates = request.body;

        const product = await prismaClient.product.findUnique({
            where: { id },
        });

        if (!product) {
            return response.status(404).json({
                error: 'Produto não encontrado.',
            });
        }

        const updatedProduct = await prismaClient.product.update({
            where: { id },
            data: updates,
        });

        return response.status(200).json(updatedProduct);
    }
}
