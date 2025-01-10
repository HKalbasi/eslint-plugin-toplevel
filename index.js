function isTopLevel(node){
  let scope = node.parent;
  while (scope.type === 'BlockStatement'){
    scope = scope.parent;
  }
  return (scope.type === 'Program');
}

function se(context){
  return node=>{
    if (isTopLevel(node)){
      context.report({
        node,
        message: `Side effects in toplevel are not allowed.`,
      })
    }
  }
}

module.exports = {
  meta:  {
    name: 'eslint-plugin-toplevel'
  },
  rules: {
    'no-toplevel-var': {
      create(context) {
        return {
          VariableDeclaration(node) {
            if (node.kind === 'var') {
              if (isTopLevel(node)) {
                context.report({
                  node,
                  message: `Unexpected var in toplevel, use const.`,
                });
              }
            }
          },
        };
      },
    },
    'no-toplevel-let': {
      create(context) {
        return {
          VariableDeclaration(node) {
            if (node.kind === 'let') {
              if (isTopLevel(node)) {
                context.report({
                  node,
                  message: `Unexpected let in toplevel, use const.`,
                });
              }
            }
          },
        };
      },
    },
    'no-toplevel-side-effect': {
      create(context) {
        const options = context.options[0] || {};

        const allowedStatements = options.allow || [];

        return {
          ExpressionStatement(node) {
            if (allowedStatements.includes(node.expression.value)) {
              return;
            }
            se(context)(node);
          },
          IfStatement: se(context),
          ForStatement: se(context),
          WhileStatement: se(context),
          SwitchStatement: se(context),
        };
      },
    },
  }
}
