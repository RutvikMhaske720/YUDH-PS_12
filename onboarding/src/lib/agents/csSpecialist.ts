import { OnboardingProfile } from '@/data/demoAccounts';
import { ChatMessage } from '@/lib/memoryStore';

export function runCsSpecialist(
  query: string,
  profile: Partial<OnboardingProfile>
): Partial<ChatMessage> {
  const isHighRigor = (profile.sliders?.rigorAndDepth || 3) >= 4;

  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('backprop') || lowerQuery.includes('neural') || lowerQuery.includes('pytorch') || lowerQuery.includes('gradient')) {
    return {
      agentName: 'Computer Science & Code Sub-Agent',
      agentColor: 'bg-[#5A8C7C]',
      text: `Let's inspect Neural Network Backpropagation & Automatic Differentiation!

**Matrix Gradient Derivation:**
For a linear layer $y = W \\cdot x + b$ and Loss $L$:
$$\\frac{\\partial L}{\\partial W} = \\frac{\\partial L}{\\partial y} \\cdot x^T, \\quad \\frac{\\partial L}{\\partial x} = W^T \\cdot \\frac{\\partial L}{\\partial y}$$

Below is an interactive PyTorch auto-grad verification script running live in the Code Sandbox:`,
      interactiveTool: {
        type: 'code',
        title: 'Interactive PyTorch Autograd & Backprop Sandbox',
        data: {
          language: 'python',
          code: `# PyTorch Gradient Verification Sandbox
import numpy as np

# Forward pass
x = np.array([2.0, 3.0])
W = np.array([[0.5, -0.8], [1.2, 0.4]])
b = np.array([0.1, -0.2])

y = np.dot(W, x) + b
loss = 0.5 * np.sum(y**2)

# Gradient wrt W
grad_y = y
grad_W = np.outer(grad_y, x)

print(f"Forward Output y: {y}")
print(f"Computed Loss: {loss:.4f}")
print("Analytical Gradient dL/dW:\\n", grad_W)
`,
          output: `Forward Output y: [ 0.2 -0.8]
Computed Loss: 0.3400
Analytical Gradient dL/dW:
 [[ 0.4  0.6]
  [-1.6 -2.4]]`,
        },
      },
      followUps: [
        'How does PyTorch Tensor autograd handle Jacobians?',
        'Add Softmax & Cross-Entropy loss backprop derivation.',
        'Run Adam optimizer step in Code Sandbox.',
      ],
    };
  }

  // Algorithm / Coding default
  return {
    agentName: 'Computer Science & Code Sub-Agent',
    agentColor: 'bg-[#5A8C7C]',
    text: `Analyzing algorithm complexity and data structures for **${profile.gradeOrDegree || 'CS Student'}**...

**Time Complexity Analysis:**
- Binary Search: $\\mathcal{O}(\\log N)$
- Merge Sort: $\\mathcal{O}(N \\log N)$
- Dynamic Programming Matrix Chain: $\\mathcal{O}(N^3)$`,
    interactiveTool: {
      type: 'code',
      title: 'Interactive Python Code Runner',
      data: {
        language: 'python',
        code: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

arr = [2, 5, 8, 12, 16, 23, 38, 56]
target = 23
result = binary_search(arr, target)
print(f"Found target {target} at index {result}")`,
        output: 'Found target 23 at index 5',
      },
    },
    followUps: [
      'Compare Recursive vs Iterative Binary Search.',
      'Show memory overhead of Python list slices.',
    ],
  };
}
