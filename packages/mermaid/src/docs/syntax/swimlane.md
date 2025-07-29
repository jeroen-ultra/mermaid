---
title: Swimlane Diagrams Syntax
---

# Swimlane Diagrams

Swimlane diagrams are horizontal flowcharts that organize nodes into lanes (rows), where each lane represents a different system, role, or responsibility. This helps visualize cross-functional processes and system interactions.

## Basic Structure

A swimlane diagram starts with the `swimlane` keyword and contains one or more lanes. Each lane has a title and can contain flowchart nodes and edges.

```mermaid-example
swimlane
    lane "Frontend System"
        A[User Interface] --> B[API Call]
    end
    lane "Backend System"
        B --> C[Process Request]
        C --> D[Generate Response]
    end
```

## Lane Definition

Lanes are defined using the `lane` keyword followed by a quoted title:

```
lane "Lane Title"
    // nodes and edges go here
end
```

## Nodes and Edges

Within each lane, you can use standard flowchart syntax for nodes and edges:

### Node Types

Currently, swimlane diagrams support rectangular nodes defined with square brackets:

```mermaid-example
swimlane
    lane "Node Examples"
        A[Rectangle Node]
        B[Another Node]
        C[Third Node]
    end
```

> **Note**: Future versions will support additional node shapes like rounded rectangles, diamonds, and circles.

### Edge Types

Swimlane diagrams support basic arrow edges with optional labels:

```mermaid-example
swimlane
    lane "Edge Examples"
        A[Start] --> B[Next]
        B -->|Process| C[End]
    end
```

## Cross-Lane Communication

Edges can connect nodes across different lanes to show system interactions:

```mermaid-example
swimlane
    lane "User"
        A[Login Request] --> B[Receive Token]
    end
    lane "Authentication Service"
        A --> C[Validate Credentials]
        C --> D[Generate JWT]
        D --> B
    end
    lane "Database"
        C --> E[Check User]
        E --> C
    end
```

## Complex Example

Here's a more complex example showing an order processing workflow:

```mermaid-example
swimlane
    lane "Customer"
        A[Place Order] --> B[Make Payment]
        H[Receive Product] --> I[Leave Review]
    end
    lane "E-commerce Platform"
        A --> C[Validate Order]
        B --> D[Process Payment]
        D --> E[Confirm Order]
    end
    lane "Fulfillment Center"
        E --> F[Pick Items]
        F --> G[Ship Order]
        G --> H
    end
    lane "Review System"
        I --> J[Store Review]
    end
```

## Best Practices

1. **Lane Organization**: Organize lanes logically, typically from top to bottom in the order of process flow
2. **Clear Labels**: Use descriptive lane titles that clearly identify the system or role
3. **Node Placement**: Place nodes within the appropriate lane based on which system/role is responsible
4. **Cross-Lane Edges**: Use cross-lane edges to show important interactions between systems
5. **Keep It Simple**: Don't overcrowd lanes with too many nodes; consider splitting complex processes

## Limitations

- Currently supports only rectangular node types `[Node Text]`
- Edge styling is limited to basic arrows `-->` with optional labels `-->|label|`
- No support for subgraphs within lanes
- Node positioning is automatic and cannot be manually adjusted
- Empty lanes are supported but will display as blank rows