import { Skeleton, Card } from "antd";

interface SkeletonLoaderProps {
  type?: "table" | "cards" | "form";
  count?: number;
}

export function SkeletonLoader({ type = "cards", count = 3 }: SkeletonLoaderProps) {
  if (type === "table") {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  if (type === "form") {
    return (
      <div className="space-y-6">
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  // cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <Skeleton active avatar paragraph={{ rows: 3 }} />
        </Card>
      ))}
    </div>
  );
}

