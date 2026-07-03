import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function realizarBackup() {
    console.log("Iniciando backup completo das tabelas...");

    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    const tabelas = [
        'employee', 'Manufacturer', 'VehicleModel', 
        'Driver', 'Vehicle', 'movement'
    ];

    const backupData: any = {};

    try {
        for (const tabela of tabelas) {
            console.log(`Exportando: ${tabela}...`);
            const nomeProp = tabela.charAt(0).toLowerCase() + tabela.slice(1);
            
            backupData[tabela] = await prisma[nomeProp].findMany();
        }

        const fileName = `backup_completo_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        const filePath = path.join(backupDir, fileName);

        fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
        console.log(`Backup realizado com sucesso em: ${filePath}`);

    } catch (error) {
        console.error("Erro ao realizar backup:", error);
    } finally {
        await prisma.$disconnect();
    }
}

realizarBackup();