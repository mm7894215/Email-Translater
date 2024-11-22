import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export async function convertPhpToHtml(phpFile: string): Promise<string> {
  try {
    // 创建临时目录存储转换后的文件
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    // 生成输出文件名
    const outputFile = path.join(
      tempDir, 
      `${path.basename(phpFile, '.php')}.html`
    );

    // 执行 PHP 命令进行转换
    await execAsync(
      `php -f ${phpFile} > ${outputFile}`
    );

    // 读取转换后的 HTML 内容
    const htmlContent = await fs.readFile(outputFile, 'utf-8');

    // 清理临时文件
    await fs.unlink(outputFile);

    return htmlContent;
  } catch (error) {
    console.error('Error converting PHP to HTML:', error);
    throw new Error('Failed to convert PHP file to HTML');
  }
} 