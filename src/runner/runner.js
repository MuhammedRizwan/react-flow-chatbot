export function createRunner(nodes, edges) {
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  const edgesFrom = edges.reduce((acc, e) => {
    acc[e.source] = acc[e.source] || [];
    acc[e.source].push(e);
    return acc;
  }, {});

  let context = {};
  let current = nodeMap["ask1"];

  function getNext(id, handle) {
    const outgoing = edgesFrom[id] || [];

    if (!handle) {
      const normal = outgoing.find(e => !e.sourceHandle);
      return nodeMap[normal?.target];
    }

    const match = outgoing.find(e => e.sourceHandle === handle);
    return nodeMap[match?.target];
  }

  async function runUntilMessage() {
    while (current) {
      const node = current;

      switch (node.type) {
        case "ask":
          current = getNext(node.id);
          return { type: "bot", text: node.data.question, success: true };

        case "validation": {
          const value = context[node.data.variable];
          const valid = /^[A-Za-z]{2,}$/.test(value || "");
          current = getNext(node.id, valid ? "pass" : "fail");

          if (!valid) {
            return {
              type: "bot",
              text: "Name must have at least 2 letters and no numbers allowed.",
              success: false
            };
          }
          break;
        }

        case "database": {
          try {
            context[node.data.key] = context["user.name"];
            current = getNext(node.id);
            break;
          } catch {
            current = getNext(node.id);
          }
          break;
        }

        case "error":
          current = getNext(node.id);
          return { type: "bot", text: "Something went wrong — try again 🙏", success: false };

        case "fallback":
          current = getNext(node.id);
          return { type: "bot", text: "Oops — didn’t get that.", success: false };

        case "ai":
          try {
            
            current = getNext(node.id);
            return { type: "bot", text: `Nice to meet you, ${context["user.name"]}!`, success: true };
          } catch (error) {
            
          }

        case "output":
          current = null;
          return { type: "end" };

        default:
          current = null;
          return null;
      }
    }
  }

  return {
    context,

    async step(userInput) {
      if (current?.type === "userInput") {
        context[current.data.variable] = userInput;
        current = getNext(current.id);
      }

      let result = await runUntilMessage();

      // 👉 if validation/error returned false → auto-run ask again
      if (result && result.success === false) {
        const next = await runUntilMessage();
        return [result, next];
      }

      return result;
    }
  };
}
