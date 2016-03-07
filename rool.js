/**
 * [description: 简单的无限滚动插件，调用方式：$('选择器').rooling(时间间隔)]
 * @version     [version]
 * @author      Chen jinSheng
 * @date        2016-02-18
 * @anotherdate 2016-02-18T15:38:07+0800
 * @param       {[type]}                 $ [description]
 * @return      {[type]}                   [description]
 */
(function ($){

    $.fn.extend({

              lock: false,
              time: null,
              // 配置
              config: function () {
                  return {
                      parentEl  : this,
                      ul        : this.find('ul'),
                      _height   : this.find('li').height()
                    
                  };
              },
              // 插件入口
              rooling: function (time) {

                  var _ts = this;

                  _ts.time = time;
                  _ts.triger(_ts.time);
                  _ts.mouseEvent();
              },
              //触发事件
              triger: function (time) {

                  var _ts = this;
                  if (_ts.lock || typeof time === 'undefined') { 
                      return false; 
                  }
                  _ts.clearTm && clearInterval(_ts.clearTm);
                  _ts.clearTm = setInterval(_ts.toscroll.bind(_ts),_ts.time);
              },
              //滚动事件
              toscroll: function () {

                  var _ts = this,
                      _c = _ts.config(),
                      first = _c.parentEl.find('li').first();  //每调用一次，重新获取第一个li

                  first.stop(true,true).animate({marginTop:-_c._height},500,function (){
                      //滚动完成
                      first.appendTo(_c.ul).css('marginTop',0);
                      //比较文本
                      _ts.comparator(_c);
                  });
              },
              //鼠标事件
              mouseEvent: function () {

                  var _ts = this,
                      _c = _ts.config();

                  _c.parentEl.hover(
                      function () {
                          clearInterval(_ts.clearTm);
                          _ts.lock = true;
                      },
                      function () {
                          _ts.lock = false;
                          _ts.triger(_ts.time);
                  });
              },
              //隐藏的文本检查器
              comparator: function (_c) {

                    var _ts = this;
                        curLi = _c.parentEl.find('li').eq(0),
                        curSpan = _c.parentEl.find('li').eq(0).find('span'),
                        li_w = curLi.width(),
                        span_w = curSpan.width(),
                        result = span_w - li_w;

                    if (_ts.lock) { 
                        return false; 
                    }
                    //清掉定时器，再进行检查
                    clearInterval(_ts.clearTm);
                    if (result > 0) {
                        //显示被盖住的文字 
                        curSpan.animate({marginLeft : -result},(result/10)+2000,function () {
                              setTimeout( function () {
                                    curSpan.animate({marginLeft : 0},(result/10)+2000,function () {
                                        _ts.triger(_ts.time);
                                    });
                              },1000);
                        });
                    }
                    else {
                        _ts.triger(_ts.time);
                    }
              }
    });

})(jQuery);