import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function gerarBackupSQL() {
    console.log("Iniciando backup SQL...");

    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    const tabelas = [
        'employee', 'Manufacturer', 'VehicleModel', 
        'Driver', 'Vehicle', 'movement'
    ];

    const fileName = `backup_sql_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
    const filePath = path.join(backupDir, fileName);

    let sqlContent = `-- Backup SQL gerado em ${new Date().toLocaleString()}\n\n`;

    try {
        for (const tabela of tabelas) {
            console.log(`Exportando: ${tabela}...`);
            const nomeProp = tabela.charAt(0).toLowerCase() + tabela.slice(1);
            
            // @ts-ignore
            const dados: any[] = await prisma[nomeProp].findMany();

            if (dados.length > 0) {
                sqlContent += `-- Tabela: ${tabela}\n`;
                
                for (const registro of dados) {
                    const colunas = Object.keys(registro).join(", ");
                    const valores = Object.values(registro).map(val => {
                        if (val === null) return 'NULL';
                        if (val instanceof Date) return `'${val.toISOString()}'`;
                        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                        if (typeof val === 'object') return `'${JSON.stringify(val)}'`;
                        return val;
                    }).join(", ");

                    sqlContent += `INSERT INTO "${tabela}" (${colunas}) VALUES (${valores});\n`;
                }
                sqlContent += `\n`;
            }
        }

        fs.writeFileSync(filePath, sqlContent);
        console.log(`Backup SQL realizado com sucesso em: ${filePath}`);

    } catch (error) {
        console.error("Erro ao gerar backup SQL:", error);
    } finally {
        await prisma.$disconnect();
    }
}

gerarBackupSQL();