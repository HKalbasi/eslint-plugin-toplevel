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
  rules: {
    'no-toplevel-var': function(context){
      return {
        "VariableDeclaration": function(node) {
          if (node.kind === "var") {
            if(isTopLevel(node)){
              context.report({
                node, 
                message: `Unexpected var in toplevel, use const.`,
              });
            }
          }
        }
      };
    },
    'no-toplevel-let': function(context){
      return {
        "VariableDeclaration": function(node) {
          if (node.kind === "let") {
            if(isTopLevel(node)){
              context.report({
                node, 
                message: `Unexpected let in toplevel, use const.`,
              });
            }
          }
        }
      };
    },
    'no-toplevel-side-effect': (context)=>({
      ExpressionStatement: (node) => {
        const options = context.options[0] || {};

        const allowedStatements = options.allow || [];

        if (allowedStatements.includes(node.expression.value)) {
          return;
        }

        return se(context)(node);
      },
      IfStatement:se(context),
      ForStatement:se(context),
      WhileStatement:se(context),
      SwitchStatement:se(context),
    }),
  }
}