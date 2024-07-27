#include <emscripten/bind.h>

using namespace emscripten;

//接收两个浮点型参数，返回一个字符串
std::string sum(double a,double b) {
    return std::to_string(a*b);
}

//公开一个方法给 JavaScript 访问
EMSCRIPTEN_BINDINGS(myModule) {
    function("sum", &sum);
}
