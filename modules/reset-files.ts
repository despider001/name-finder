import { fileMapper as fm } from './file-mapper';
import * as fs from 'fs';

export const resetFiles = (): boolean => {
    try {
        fs.existsSync(fm.outputFile) && fs.unlinkSync(fm.outputFile); 
        fs.existsSync(fm.statusFile) && fs.unlinkSync(fm.statusFile); 
        fs.existsSync(fm.brokenWordsFile) && fs.unlinkSync(fm.brokenWordsFile); 
        return true
    } catch (error) {
        console.error('error found in resetFiles: ', error);
        return false;
    }
}