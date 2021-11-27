sed -r -e "s/\"/'/g" ice_cream.svg   `#Replace quotes " with ''` \
  | sed -r -e "s/[ ]{2,}</</g"       `#Replace " * <" with "<"` \
  | sed -r -e "s/[ ]{2,}/ /g"        `#Replace " * " with " "` \
  | tr --delete '\n'                 `#Remove line breaks` \
  > ice_cream_compressed.svg         `#Write output`
