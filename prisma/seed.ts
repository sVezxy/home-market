import { PrismaClient } from '@prisma/client';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
    try{
        const categoryInitial = [
            "Room",
            "Apartment",
            "Dormitory"
        ];

        for( const categoryName of categoryInitial ){
            await prisma.category.upsert({
                where: {typeCategory: categoryName},
                update: {},
                create: {typeCategory: categoryName}
            });
        }
    }catch(error){
        console.log(error);
        process.exitCode = 1;
        
    } finally {
        await prisma.$disconnect();
    }

}

main();