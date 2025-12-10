import { Card } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { cn } from "@/lib/utils";

interface TypographyCardProps {
  id: string;
  name: string;
  description: string;
  preview: string;
  fontFamily: string;
  selected?: boolean;
  onClick?: () => void;
}

const TypographyCard = ({
  id,
  name,
  description,
  preview,
  fontFamily,
  selected = false,
  onClick,
}: TypographyCardProps) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      className={cn(
        "style-card overflow-hidden transition-all duration-300",
        selected && "selected"
      )}
    >
      <div className="flex flex-col gap-4">
        <div 
          className="text-3xl py-4 text-center text-foreground"
          style={{ fontFamily }}
        >
          {preview}
        </div>
        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-foreground">{name}</span>
            {selected && <CheckCircleFilled className="text-xl text-primary" />}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default TypographyCard;
