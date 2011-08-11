A custom jQuery method to convert nested-attributes field names into an object hash:
(Similar to the way Rails converts field names to a models heirarchy)

Sample usage: $(":text").nestedAttr() returns a {js-hash-of-hierarchal-data}

So when the page includes a field like this: <input name="list[items_attributes][2][row]" value="tada!"> 
then the hash returned by the method will be formed of nested arrays and objects like this:
  {
    list: {
      items_attributes: [
        { row: "" },
        { row: "" },
        { row: "tada!" }
      ]
    }
  }

Other non-form elements can be parsed as "fields" too if you give them a data-name attribute. Their contents will be extracted as the "field value" unless you can specify the value explicitly in a data-value attribute.

options:
  seed     : An object hash representing the bare minimum data heirarchy you expect to return from this method. Attributes will be added to this. Use this to avoid blanks and missing arrays etc.
  trim     : A function for trimming the field values. Defaults to remove any whitespace prefix/suffix from field value. Is passed the field value as its first argument.
  isNested : A function to test whether the field name appears to use the nested[attributes][syntax]. Is passed the field name as its first argument.

By George Adamson August 2011


TODO:
- Allow for missing indexes in nested-arrays