/**
 * 基础Frida脚本示例 - 用于hook本地函数
 * 
 * 该脚本演示如何拦截本地库中的函数调用
 */

// 定义目标函数
const targetFunction = '0x40D120';

console.log('[+] 开始拦截 ' + targetFunction + ' 函数');

// 使用Interceptor拦截函数
Interceptor.attach(ptr(targetFunction), {
    onEnter: function(args) {
        console.log('[+] 函数 ' + targetFunction + ' 被调用');
        console.log('[+] 参数1: ' + args[0]);
        console.log('[+] 参数2: ' + args[1]);
        
        // 保存上下文供onLeave使用
        this.arg0 = args[0];
        this.arg1 = args[1];
    },
    
    onLeave: function(retval) {
        console.log('[+] 函数 ' + targetFunction + ' 返回: ' + retval);
        console.log('[+] 参数1的值: ' + this.arg0);
        
        // 可选：修改返回值
        // retval.replace(0);
        
        return retval;
    }
});

// 添加内存扫描功能
function scanMemoryForPattern() {
    console.log('[+] 开始内存扫描...');
    
    const pattern = '12 34 56 78';
    const ranges = Process.enumerateRangesSync({protection: 'r--', coalesce: true});
    
    for (let range of ranges) {
        try {
            Memory.scanSync(range.base, range.size, pattern).forEach(match => {
                console.log('[+] 在 ' + match.address + ' 发现匹配');
            });
        } catch (e) {
            // 忽略无法访问的内存区域
        }
    }
}

// 主程序
function main() {
    console.log('[+] Frida脚本已加载');
    
    // 在主线程中执行其他逻辑
}

main();