/*!
 * verySuggester version 0.1
 * plears check the link below for more information.
 * https://github.com/avery20024/verySuggester
 *
 * Copyright (c) 2016 Avery Wu
 * Released under the MIT license
 *
 * Last Modified: 2016-08-21
 */


(function($) {

  var methods = {
    init: function(customConfig) {
        var configs = $.extend({
          width: $(this).outerWidth(),
          distance: 5,
          additionalClass: '',
          pivotType: 'bottom',
          searchSymbol: '@',
          fontColor: '#FFF',
          themeColor: '#6D6D6D',
          limitItem: 0,
          searchList: ['hotmail.com', 'gmail.com', 'yahoo.com.tw']
        }, customConfig);

        // symble防呆，並記錄config
        $(this).data( 'verySuggester', methods.checkSymbol(configs) );

        // 塞入標籤及設定定位
        methods.makeListAndSetLocation.call(this);

        // 事件綁定
        $(this)
          .keydown(function(e) {
            if(e.which === 40 || e.which === 38 || e.which === 13) e.preventDefault();
          })
          .keyup( methods.handleKeyup )
          .focus( function() {
            var box = $(this).siblings('.suggest-box');

            if(box.find('.suggest-list').html() !== '')  box.show();
          })
          .blur( function() {
            $(this).siblings('.suggest-box').delay().stop().fadeOut(150);
          });
    },

    makeListAndSetLocation: function() {
      var inputDom = $(this),
          configs = inputDom.data('verySuggester'),
          box,
          boxSetting = {},
          listSetting = {},
          arrowSetting = {};

      inputDom
        .wrap('<div class="suggest-wrap"></div>')
        .after('<div class="suggest-box"><div class="suggest-arrow"></div><div class="suggest-list"></div></div>');

      box = inputDom.siblings('.suggest-box');

      if(configs.additionalClass !== '') {
        box.addClass(configs.additionalClass);
      }

      if(configs.pivotType.toLowerCase() === 'bottom') {
        boxSetting = {
          'top': parseInt(inputDom.css('margin-top')) + inputDom.outerHeight() + configs.distance,
        }
        listSetting = {
          'top': '10px',
        }
        arrowSetting = {
          'top': configs.distance * -2,
          'border-bottom-color': configs.themeColor
        }
      } else if(configs.pivotType.toLowerCase() === 'top') {
        boxSetting = {
          'top': parseInt(inputDom.css('margin-top')) - configs.distance
        }
        listSetting = {
          'top': 'auto',
          'bottom': '10px'
        }
        arrowSetting = {
          'top': 'auto',
          'bottom': '-10px',
          'border-top-color': configs.themeColor
        }
      }
      boxSetting.left = parseInt(inputDom.css('margin-left'));

      box
        .css( boxSetting )
        .find('.suggest-list')
          .css( listSetting )
          .css({
            'width'       : parseInt(configs.width),
            'border-color': configs.themeColor
          })
        .end()
        .find('.suggest-arrow')
          .css( arrowSetting );
    },

    checkSymbol: function(configs) {
      var searchList = configs.searchList,
          i = 0;

      for(i; i < searchList.length; i++) {
        if(searchList[i].slice(0, 1) !== configs.searchSymbol) {
          searchList[i] = configs.searchSymbol + searchList[i];
        }
      }
      return configs;
    },

    handleKeyup: function( event ) {
      var inputDom = $(this),
          configs = inputDom.data('verySuggester'),
          inputValue = inputDom.val(),
          box = inputDom.siblings('.suggest-box'),
          list = box.find('.suggest-list'),
          listItem = [];

      // 擋掉沒有必要產生清單的狀況
      if (inputDom.val().indexOf(configs.searchSymbol) === -1 ||
          inputDom.val().slice(0, $(this).val().indexOf(configs.searchSymbol)) === '') {
        box.hide();
        return;
      }

      // 方向鍵移動focus項目
      if(event.which === 38 || event.which === 40) { // ↑ ↓
        methods.moveThroughItem.call(this, event.which, box.find('.suggest-list'));
        return;
      } else if(event.which === 13) { // enter
        if(box.find('.suggest-list').find('.cur').length === 0) return;
        methods.selectItem(box.find('.cur'), inputDom);
        return;
      }

      // 組清單
      var firstPart = inputValue.slice( inputValue.indexOf(configs.searchSymbol) );
      var secondPart = inputValue.slice( 0, inputValue.indexOf(configs.searchSymbol) );

      for(var i = 0; i < configs.searchList.length; i++) {
        if( configs.searchList[i].indexOf( firstPart ) !== -1 ) {
          listItem.push(
            '<div class="suggest-item" data-idx="' + listItem.length + '">' +
            '<span class="suggest-retain">' + secondPart + '</span>' +
            '<span class="suggest-domain">' + configs.searchList[i] + '</span>' +
            '</div>'
          );
        }
      }

      if(listItem.length > 0) {
        var arrow = box.find('.suggest-arrow'),
            max = 0;

        list
          .html( listItem.join('') )
          .promise().done(function() {
            list.find('.suggest-domain')
              .each(function(idx, item) { if($(item).outerWidth() > max)  max = $(item).outerWidth();});
              console.log(max, list.find('.suggest-item').width()-max);
            list.find('.suggest-retain').css('max-width', list.find('.suggest-item').width()-max);
          });

        // item當前效果
        list.children().hover(function() {
          $(this).addClass('cur').siblings().removeClass('cur');
          methods.updateChosenStyle(list, configs);
        }, function() {
          $(this).siblings().add($(this)).removeClass('cur');
          methods.updateChosenStyle(list, configs);
        });

        if(configs.limitItem !== 0) {
          list.css({
            'max-height': (list.children().outerHeight() * configs.limitItem) + 3,
            'overflow-y': 'auto'
          });
        }

        box
          .find('.suggest-item')
            .click(function() {
              methods.selectItem($(this), inputDom);
            })
          .end().show();

      } else {
        box.hide().find(list).html('');
      }
    },

    moveThroughItem: function( key, list ) {
      var configs = $(this).data('verySuggester'),
          curItem = list.children('.cur').data('idx'),
          resultIdx = 0;

      if(key === 40) {
        resultIdx = (curItem || curItem == 0) ? curItem + 1 : 0;
      } else if (key === 38) {
        resultIdx = (curItem) ? curItem - 1 : list.children().length-1;
      }

      switch (key) {
        case 40:
          resultIdx = (curItem || curItem == 0) ? curItem + 1 : 0;
          break;
        case 38:
          resultIdx = (curItem) ? curItem - 1 : list.children().length-1;
          break;
        default:
          break;
      }

      // 切換cur
      list.children().removeClass('cur').eq(resultIdx).addClass('cur');
      methods.updateChosenStyle(list, configs);
    },

    // 點選項目
    selectItem: function(self, dom) {
      var configs = dom.data('verySuggester');

      dom.val(self.text());
      // reset
      dom.siblings('.suggest-box').find('.suggest-list').html('').end().hide();
    },

    updateChosenStyle: function(_list, configs) {
      _list
        .children()
          .prop('style', '')
        .filter('.cur')
          .css({
            'background': configs.themeColor,
            'color'     : configs.fontColor
          });
    }
  };

  $.fn.verySuggester = function( method ) {
    return this.each(function() {
      if( methods[method] ) {
        return methods[ method ].apply( this, Array.prototype.slice.call(arguments, 1) );
      } else if( !method || typeof method === 'object' ) {
        return methods.init.call( this, method );
      } else {
        $.error('Method ' + method + ' does not exist on jQuery.tooltip');
      }
    });
  };

})(jQuery);
