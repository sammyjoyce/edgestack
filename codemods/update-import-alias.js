function transformer(fileInfo, { jscodeshift: j }) {
  return j(fileInfo.source)
    .find(j.ImportDeclaration)
    .forEach(path => {
      const src = path.node.source.value;
      if (typeof src === "string" && src.startsWith("@components/")) {
        path.node.source.value = src.replace("@components/", "@common/ui/");
      }
    })
    .toSource();
}

module.exports = transformer;
module.exports.parser = 'tsx';
