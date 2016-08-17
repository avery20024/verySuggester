/*!
 * verySuggester version 0.1
 * plears check the link below for more information.
 * https://github.com/avery20024/verySuggester
 *
 * Copyright (c) 2016 Avery Wu
 * Released under the MIT license
 *
 * Last Modified: 2016-08-08
 */


(function($) {

  var methods = {
    init: function(customConfig) {
      return this.each(function(eachRound) {

        var configs = $.extend({
          width: $(this).outerWidth(),
          distance: 5,
          pivotType: 'bottom',
          searchSymbol: '@',
          wrapClass: 'suggest-wrap',
          listClass: 'suggest-list',
          itemClass: 'suggest-item',
          themeColor: '#26a4d8',
          searchList: ['hotmail.com', 'gmail.com', 'yahoo.com.tw']
        }, customConfig);

        // symble防呆，並記錄config
        $(this).data( 'verySuggester', methods.checkSymbol(configs) );

        // 塞入標籤及設定定位
        methods.makeListAndSetLocation.call(this);

        // 事件綁定
        $(this).keydown(function(e) {
          if(e.which === 40 || e.which === 38 || e.which === 13) e.preventDefault();
        });
        $(this).keyup( methods.handleKeyup );
        $(this).focus( function() {
          var box = $(this).siblings('.suggest-box');

          if(box.find('.' + configs.listClass).children().length > 0)  box.show();
        });

        $(this).blur( function() {
          var hideBox = setTimeout(function() {
            
            $(this).siblings('.suggest-box').fadeOut(150);
          }.bind(this), 1000);
        });

      });
    },

    makeListAndSetLocation: function() {
      var inputDom = $(this),
          configs = inputDom.data('verySuggester'),
          box,
          arrow,
          boxPosition = {},
          arrowPosition = {};

      inputDom
        .wrap('<div class="' + configs.wrapClass + '"></div>')
        .after('<div class="suggest-box"><div class="suggest-arrow"></div><div class="' + configs.listClass + '"></div></div>');

      box = inputDom.siblings('.suggest-box');
      arrow = box.find('.suggest-arrow');

      if(configs.pivotType === 'bottom') {
        boxPosition = {
          top: parseInt(inputDom.css('margin-top')) + inputDom.outerHeight() + configs.distance,
          bottom: 'auto',
          left: parseInt(inputDom.css('margin-left'))
        }
      } else {
        boxPosition = {
          top: 'auto',
          bottom: parseInt(inputDom.css('margin-bottom')) + inputDom.outerHeight() + configs.distance,
          left: parseInt(inputDom.css('margin-left'))
        }
      }

      box
        .css( boxPosition )
        .find('.' + configs.listClass)
          .css({
            'width'       : parseInt(configs.width),
            'border-color': configs.themeColor
          })
          .data('item', configs.searchList)
          .parent('.' + configs.wrapClass)
            .addClass(configs.pivotType + '-box');

      if(configs.pivotType === 'bottom') {
        arrowPosition = {
          'border-bottom-color': inputDom.data('verySuggester').themeColor
        }
      } else {
        arrowPosition = {
          'border-top-color': inputDom.data('verySuggester').themeColor
        }
      }
      arrow.css( arrowPosition );

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
          listItem = [];

      // 擋掉沒有必要產生清單的狀況
      if( inputDom.val().indexOf(configs.searchSymbol) === -1 ||
          inputDom.val().slice(0, $(this).val().indexOf(configs.searchSymbol)) === ''
        ) {
          box.hide().find('.' + configs.listClass).html('');
          return;
      }

      // 方向鍵移動focus項目
      if(event.which === 38 || event.which === 40) { // ↑ ↓
        methods.moveThroughItem.call(this, event.which, box.find('.' + configs.listClass));
        return;
      } else if(event.which === 13) { // enter
        if(box.find('.' + configs.listClass).find('.cur').length === 0) return;
        methods.selectItem(box.find('.cur'), inputDom);
        return;
      }

      var firstPart = inputValue.slice( inputValue.indexOf(configs.searchSymbol) );
      var secondPart = inputValue.slice( 0, inputValue.indexOf(configs.searchSymbol) );

      for(var i = 0; i < configs.searchList.length; i++) {
        if( configs.searchList[i].indexOf( firstPart ) !== -1 ) {
          listItem.push(
            '<div class="' + configs.itemClass + '" data-idx="' + listItem.length + '">' +
              '<span class="suggest-retain">' + secondPart + '</span>' +
              '<span class="suggest-domain">' + configs.searchList[i] + '</span>' +
            '</div>'
          );
        }
      }

      if(listItem.length > 0) {
        var list = box.find('.' + configs.listClass),
            arrow = box.find('.suggest-arrow'),
            max = 0;

        list
          .html( listItem.join('') )
          .find('.suggest-domain')
            .each(function(idx, item) { if($(item).width() > max)  max = $(item).width(); })
            .siblings('.suggest-retain')
              .css('max-width', 'calc(100% - ' + (max+2) + 'px)');

        // 事件
        list.children().hover(function() {
          $(this).css({ 'background-color' : inputDom.data('verySuggester').themeColor });
        }, function() {
          $(this).css({ 'background-color' : 'initial' , color: 'initial'});
        });

        box.find('.' + configs.itemClass).click(function() {
          methods.selectItem($(this), inputDom);
        });

        box.show();

      } else {
        box.hide().find('.' + configs.listClass).html('');
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
        default:  break;
      }

      // 模擬cur樣式效果
      list
        .children()
          .css({ 'background-color' : 'initial' })
          .removeClass('cur')
        .eq(resultIdx)
          .css({ 'background-color' : configs.themeColor})
          .addClass('cur');
    },

    // 點選項目
    selectItem: function(self, dom) {
      var configs = dom.data('verySuggester');

      dom.val(self.text());
      // reset
      dom.siblings('.suggest-box').find('.' + configs.listClass).html('').end().hide();
    }

  };

  $.fn.verySuggester = function( method ) {
      if( methods[method] ) {
        return methods[ method ].apply( this, Array.prototype.slice.call(arguments, 1) );
      } else if( !method || typeof method === 'object' ) {
        return methods.init.call( this, method );
      } else {
        $.error('Method ' + method + ' does not exist on jQuery.tooltip');
      }
  };

})(jQuery);
