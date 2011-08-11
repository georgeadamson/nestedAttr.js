// Helper method to convert several nested-attributes field names into an object hash:
// (Similar to the way Rails converts field names to a models heirarchy)
// Eg: When name="list[items_attributes][3][row]" then $(":text").nestedAttr() => list.items_attributes[3].row
// Relies on our custom jQuery utility method $.nestedAttr()
// options hash:
//   seed     : An object hash representing the bare minimum data heirarchy you expect to return from this method. Attributes will be added to this. Use this to avoid blanks and missing arrays etc.
//   trim     : A function for trimming the field values. Defaults to remove any whitespace prefix/suffix from field value. Is passed the field value as its first argument.
//   isNested : A function to test whether the field name appears to use the nested[attributes][syntax]. Is passed the field name as its first argument.
// By George Adamson August 2011

(function($,undefined){

  // Extend jQuery's methods:
	$.fn.extend({

    nestedAttr : function(options){

      // Apply default options where none specified: (Other defaults are defined in the $.nestedAttr method)
      var defaults = {
        seed : {}
      };
      options = $.extend( {}, defaults, options );

      var result = options.seed, fields = this.find('*').andSelf().filter('[name],[data-name]');

      fields.each(function(){
        $.extend( true, result, $.nestedAttr(this,options) );
      });

      return result;

    }

	});


  // Extend jQuery's utility methods:
  $.extend( {

      /*
       * Helper to convert a nested-attributes field name into an object hash:
       * (Similar to the way Rails converts a field name to a models heirarchy)
       * Eg: "list[items_attributes][3][row]" => list.items_attributes[3].row
       *
       * Usage:
       * - $.nestedAttr(elem,options) -OR-
       * - $.nestedAttr(fieldName,fieldValue,options)
       */
      nestedAttr : function(name, value, options){

        // Derive name and value if an element was provided:
        if( typeof name !== 'string' ){
          var field = $(name);
          options   = value;
          name      = field.attr('name') || field.data('name');
          value     = field.is('[data-value]') 
                      ? field.data('value') 
                      : field.is(':checkbox,:radio') 
                        ? field.prop('checked') 
                        : field.is('INPUT,SELECT,TEXTAREA') 
                          ? field.val()
                          : field.is('IMG')
                            ? field.attr('src')
                            : field.text();
        }

        // Apply default options where none specified:
        var defaults = {
          trim     : function(text){ return (''+text).split(/^\s*|\s*$/g).join('') }, // Trim whitespace from field value
          isNested : function(name){ return /.+\[.*\]$/.test(name) }                  // Skip simple field names that don't look[like][nested][attributes]
        };
        options = $.extend( {}, defaults, options );

        // No point in proceeding if there's no name attribute to parse or name is too simple:
        if( !name || ( $.isFunction(options.isNested) && !options.isNested(name) ) ){ return {} }

        // Separate name into its component parts at each '[' or ']':
        var subTree,
            branch,
            branches = name.replace(/\[(\w+)\]/g,'|$1').split('|'),               // (Or just .split(/\[(\w+)\]/) if we don't mind some blanks)
            tree     = $.isFunction(options.trim) ? options.trim(value) : value;  // Begin with the value (for the 'leaf' node)

        // Assemble the object "tree", starting with the right-most attribute and deriving its parents one by one:
        // (Assume non-numeric attributes are the names of objects, and the rest are arrays)
        while( (branch=branches.pop()) !== undefined ){
          subTree      = tree;
          tree         = ( branch && isNaN(branch) ) ? {} : [];
          tree[branch] = subTree;
        }

        return tree;

      }

  });

})(jQuery);