!function(t){"use strict";function e(t){return"chip"}function i(t){return t?t.toString():t}function n(t){return this.itemValue(t)}function a(t){return null}function r(t,e){e.hide().fadeIn()}function o(e,i){this.itemsArray=[],this.$element=t(e),this.$element.hide(),this.objectItems=i&&i.itemValue,this.placeholderText=e.hasAttribute("placeholder")?this.$element.attr("placeholder"):"",this.inputSize=Math.max(1,this.placeholderText.length),this.$container=t('<div class="materialize-tags"></div>'),this.$input=t('<input type="text" class="n-tag"  placeholder="'+this.placeholderText+'"/>').appendTo(this.$container),this.$label=this.$element.parent().find("label"),this.$element.before(this.$container),this.build(i),this.$label.on("click",function(){t(this).addClass("active"),t(this).next(".materialize-tags").find("input.n-tag").focus()}),this.$input.on("focus",function(){var e=t(this).parents(".materialize-tags").parent().find("label");t(this).parents(".materialize-tags").addClass("active"),e.hasClass("active")||e.addClass("active")}).on("focusout",function(){var e=t(this).parents(".materialize-tags"),i=e.find("span.chip");e.removeClass("active"),0==i.length&&e.parent().find("label").removeClass("active")})}function s(t,e){if("function"!=typeof t[e]){var i=t[e];t[e]=function(t){return t[i]}}}function l(t,e){if("function"!=typeof t[e]){var i=t[e];t[e]=function(){return i}}}function u(t){return t?m.text(t).html():""}function c(t){var e=0;if(document.selection){t.focus();var i=document.selection.createRange();i.moveStart("character",-t.value.length),e=i.text.length}else(t.selectionStart||"0"==t.selectionStart)&&(e=t.selectionStart);return e}function p(e,i){var n=!1;return t.each(i,function(t,i){if("number"==typeof i&&e.which===i)return n=!0,!1;if(e.which===i.which){var a=!i.hasOwnProperty("altKey")||e.altKey===i.altKey,r=!i.hasOwnProperty("shiftKey")||e.shiftKey===i.shiftKey,o=!i.hasOwnProperty("ctrlKey")||e.ctrlKey===i.ctrlKey;if(a&&r&&o)return n=!0,!1}}),n}var h={tagClass:e,itemValue:i,itemText:n,itemTitle:a,freeInput:!0,addOnBlur:!0,maxTags:void 0,maxChars:void 0,confirmKeys:[9,13,44],onTagExists:r,trimValue:!0,allowDuplicates:!1};o.prototype={constructor:o,add:function(e,i,n){var a=this;if(!(a.options.maxTags&&a.itemsArray.length>=a.options.maxTags||e!==!1&&!e)){if("string"==typeof e&&a.options.trimValue&&(e=t.trim(e)),"object"==typeof e&&!a.objectItems)throw"Can't add objects when itemValue option is not set";if(!e.toString().match(/^\s*$/)){if("string"==typeof e&&"INPUT"===this.$element[0].tagName){var r=e.split(",");if(r.length>1){for(var o=0;o<r.length;o++)this.add(r[o],!0);return void(i||a.pushVal())}}var s=a.options.itemValue(e),l=a.options.itemText(e),c=a.options.tagClass(e),p=a.options.itemTitle(e),h=t.grep(a.itemsArray,function(t){return a.options.itemValue(t)===s})[0];if(!h||a.options.allowDuplicates){if(!(a.items().toString().length+e.length+1>a.options.maxInputLength)){var m=t.Event("beforeItemAdd",{item:e,cancel:!1,options:n});if(a.$element.trigger(m),!m.cancel){a.itemsArray.push(e);var f=t('<span class="'+u(c)+(null!==p?'" title="'+p:"")+'">'+u(l)+'<i class="material-icons" data-role="remove">close</i></span>');f.data("item",e),a.findInputWrapper().before(f),f.after(" "),i||a.pushVal(),(a.options.maxTags===a.itemsArray.length||a.items().toString().length===a.options.maxInputLength)&&a.$container.addClass("materialize-tags-max"),a.$element.trigger(t.Event("itemAdded",{item:e,options:n}))}}}else if(a.options.onTagExists){var d=t(".tag",a.$container).filter(function(){return t(this).data("item")===h});a.options.onTagExists(e,d)}}}},remove:function(e,i,n){var a=this;if(a.objectItems&&(e="object"==typeof e?t.grep(a.itemsArray,function(t){return a.options.itemValue(t)==a.options.itemValue(e)}):t.grep(a.itemsArray,function(t){return a.options.itemValue(t)==e}),e=e[e.length-1]),e){var r=t.Event("beforeItemRemove",{item:e,cancel:!1,options:n});if(a.$element.trigger(r),r.cancel)return;t(".chip",a.$container).filter(function(){return t(this).data("item")===e}).remove(),-1!==t.inArray(e,a.itemsArray)&&a.itemsArray.splice(t.inArray(e,a.itemsArray),1)}i||a.pushVal(),a.options.maxTags>a.itemsArray.length&&a.$container.removeClass("materialize-tags-max"),a.$element.trigger(t.Event("itemRemoved",{item:e,options:n}))},removeAll:function(){var e=this;for(t(".chip",e.$container).remove();e.itemsArray.length>0;)e.itemsArray.pop();e.pushVal()},refresh:function(){var e=this;t(".chip",e.$container).each(function(){var i=t(this),n=i.data("item"),a=(e.options.itemValue(n),e.options.itemText(n)),r=e.options.tagClass(n);i.attr("class",null),i.addClass("tag "+u(r)),i.contents().filter(function(){return 3==this.nodeType})[0].nodeValue=u(a)})},items:function(){return this.itemsArray},pushVal:function(){var e=this,i=t.map(e.items(),function(t){return e.options.itemValue(t).toString()});e.$element.val(i,!0).trigger("change")},build:function(e){var i=this;if(i.options=t.extend({},h,e),i.objectItems&&(i.options.freeInput=!1),s(i.options,"itemValue"),s(i.options,"itemText"),l(i.options,"tagClass"),i.options.typeaheadjs){var n=null,a={},r=i.options.typeaheadjs;t.isArray(r)?(n=r[0],a=r[1]):a=r,i.$input.typeahead(n,a).on("typeahead:selected",t.proxy(function(t,e){i.add(a.valueKey?e[a.valueKey]:e),i.$input.typeahead("val","")},i))}i.$container.on("click",t.proxy(function(t){i.$element.attr("disabled")||i.$input.removeAttr("disabled"),i.$input.focus()},i)),i.options.addOnBlur&&i.options.freeInput&&i.$input.on("focusout",t.proxy(function(e){0===t(".typeahead, .twitter-typeahead",i.$container).length&&(i.add(i.$input.val()),i.$input.val(""))},i)),i.$container.on("keydown","input",t.proxy(function(e){var n=t(e.target),a=i.findInputWrapper();if(i.$element.attr("disabled"))return void i.$input.attr("disabled","disabled");switch(e.which){case 8:if(0===c(n[0])){var r=a.prev();r&&i.remove(r.data("item"))}break;case 46:if(0===c(n[0])){var o=a.next();o&&i.remove(o.data("item"))}break;case 37:var s=a.prev();0===n.val().length&&s[0]&&(s.before(a),n.focus());break;case 39:var l=a.next();0===n.val().length&&l[0]&&(l.after(a),n.focus())}{var u=n.val().length;Math.ceil(u/5)}n.attr("size",Math.max(this.inputSize,n.val().length))},i)),i.$container.on("keydown","input",t.proxy(function(e){var n=t(e.target);if(i.$element.attr("disabled"))return void i.$input.attr("disabled","disabled");var a=n.val(),r=i.options.maxChars&&a.length>=i.options.maxChars;i.options.freeInput&&(p(e,i.options.confirmKeys)||r)&&(i.add(r?a.substr(0,i.options.maxChars):a),n.val(""),e.preventDefault());{var o=n.val().length;Math.ceil(o/5)}n.attr("size",Math.max(this.inputSize,n.val().length))},i)),i.$container.on("click","[data-role=remove]",t.proxy(function(e){i.$element.attr("disabled")||i.remove(t(e.target).closest(".chip").data("item"))},i)),i.options.itemValue===h.itemValue&&"INPUT"===i.$element[0].tagName&&i.add(i.$element.val())},destroy:function(){var t=this;t.$container.off("keydown","input"),t.$container.off("click","[role=remove]"),t.$container.remove(),t.$element.removeData("materialtags"),t.$element.show()},focus:function(){this.$input.focus()},input:function(){return this.$input},findInputWrapper:function(){for(var e=this.$input[0],i=this.$container[0];e&&e.parentNode!==i;)e=e.parentNode;return t(e)}},t.fn.materialtags=function(e,i,n){var a=[];return this.each(function(){var r=t(this).data("materialtags");if(r)if(e||i){if(void 0!==r[e]){if(3===r[e].length&&void 0!==n)var s=r[e](i,null,n);else var s=r[e](i);void 0!==s&&a.push(s)}}else a.push(r);else r=new o(this,e),t(this).data("materialtags",r),a.push(r),t(this).val(t(this).val())}),"string"==typeof e?a.length>1?a:a[0]:a},t.fn.materialtags.Constructor=o;var m=t("<div />");t(function(){t("input[data-role=materialtags]").materialtags()})}(window.jQuery);
//# sourceMappingURL=materialize-tags.min.js.map