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

```mermaid-example
swimlane
    lane "Node Examples"
        A[Rectangle]
        B(Rounded Rectangle)
        C{Diamond}
        D((Circle))
    end
```

### Edge Types

```mermaid-example
swimlane
    lane "Edge Examples"
        A[Start] --> B[Arrow]
        B -.-> C[Dotted]
        C ==> D[Thick]
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
    end
    lane "Database"
        C --> E[Check User]
        E --> C
        D --> B
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

- Currently supports basic flowchart node types (rectangles, circles, diamonds)
- Edge styling is limited to basic arrow types
- No support for subgraphs within lanes
- Node positioning is automatic and cannot be manually adjusted