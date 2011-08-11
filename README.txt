Helper method to convert several nested-attributes field names into an object hash:
(Similar to the way Rails converts field names to a models heirarchy)

Eg: When name="list[items_attributes][3][row]" then $(":text").nestedAttr() => list.items_attributes[3].row

Other elements can be parsed as "fields" if you give them a data-name attribute. Their contents will be extracted as the "field value" unless you can specify the value explicitly in a data-value attribute.

options hash:
  seed     : An object hash representing the bare minimum data heirarchy you expect to return from this method. Attributes will be added to this. Use this to avoid blanks and missing arrays etc.
  trim     : A function for trimming the field values. Defaults to remove any whitespace prefix/suffix from field value. Is passed the field value as its first argument.
  isNested : A function to test whether the field name appears to use the nested[attributes][syntax]. Is passed the field name as its first argument.

By George Adamson August 2011

