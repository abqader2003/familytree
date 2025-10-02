import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  residence?: string;
  occupation?: string;
  bio?: string;
  whatsapp?: string;
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
  role?: "admin" | "user" | "none";
}

interface FamilyTreeCanvasProps {
  persons: Person[];
  onPersonClick: (person: Person) => void;
  isLoggedIn?: boolean;
}

export default function FamilyTreeCanvas({ persons, onPersonClick, isLoggedIn }: FamilyTreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!containerRef.current || persons.length === 0) return;

    const nodes = persons.map((person) => ({
      id: person.id,
      label: `${person.firstName} ${person.lastName}\n${person.age ? `${person.age} سنة` : ""}`,
      shape: "box",
      margin: { top: 12, right: 12, bottom: 12, left: 12 },
      font: {
        size: 14,
        face: "Cairo, sans-serif",
        color: "#2c3e50",
        multi: true,
      },
      color: {
        background: "#ffffff",
        border: "#d4cfc4",
        highlight: {
          background: "#f8f6f3",
          border: "#2d4463",
        },
      },
      borderWidth: 2,
      borderWidthSelected: 3,
      shadow: {
        enabled: true,
        color: "rgba(0,0,0,0.1)",
        size: 8,
        x: 2,
        y: 2,
      },
    }));

    const edges: any[] = [];
    persons.forEach((person) => {
      if (person.fatherId) {
        edges.push({
          from: person.fatherId,
          to: person.id,
          arrows: "to",
          color: { color: "#2d4463", opacity: 0.8 },
          width: 2,
          smooth: {
            enabled: true,
            type: "cubicBezier",
            roundness: 0.5,
          },
        });
      }
      if (person.spouseId) {
        edges.push({
          from: person.id,
          to: person.spouseId,
          color: { color: "#9b7653", opacity: 0.6 },
          width: 2,
          dashes: false,
          smooth: false,
        });
      }
    });

    const data = { nodes, edges };

    const options = {
      layout: {
        hierarchical: {
          direction: "UD",
          sortMethod: "directed",
          nodeSpacing: 180,
          levelSeparation: 200,
        },
      },
      physics: {
        enabled: false,
      },
      interaction: {
        dragNodes: false,
        dragView: true,
        zoomView: true,
        navigationButtons: false,
      },
      nodes: {
        fixed: {
          x: false,
          y: false,
        },
      },
    };

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    network.on("click", (params) => {
      if (params.nodes.length > 0) {
        const personId = params.nodes[0];
        const person = persons.find((p) => p.id === personId);
        if (person) {
          onPersonClick(person);
        }
      }
    });

    network.on("zoom", () => {
      const scale = network.getScale();
      setZoomLevel(scale);
    });

    return () => {
      network.destroy();
    };
  }, [persons, onPersonClick]);

  const handleZoomIn = () => {
    if (networkRef.current) {
      const currentScale = networkRef.current.getScale();
      networkRef.current.moveTo({ scale: currentScale * 1.2 });
    }
  };

  const handleZoomOut = () => {
    if (networkRef.current) {
      const currentScale = networkRef.current.getScale();
      networkRef.current.moveTo({ scale: currentScale * 0.8 });
    }
  };

  const handleFitView = () => {
    if (networkRef.current) {
      networkRef.current.fit({
        animation: {
          duration: 500,
          easingFunction: "easeInOutQuad",
        },
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-background">
      <div ref={containerRef} className="w-full h-full" />
      
      <div className="fixed bottom-6 left-6 flex flex-col gap-2 z-10" dir="ltr">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          className="backdrop-blur-lg bg-card/90 shadow-lg hover-elevate"
          data-testid="button-zoom-in"
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          className="backdrop-blur-lg bg-card/90 shadow-lg hover-elevate"
          data-testid="button-zoom-out"
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleFitView}
          className="backdrop-blur-lg bg-card/90 shadow-lg hover-elevate"
          data-testid="button-fit-view"
        >
          <Maximize2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="fixed bottom-6 right-6 px-4 py-2 bg-card/90 backdrop-blur-lg rounded-lg shadow-md text-sm text-muted-foreground">
        تكبير: {Math.round(zoomLevel * 100)}%
      </div>
    </div>
  );
}
