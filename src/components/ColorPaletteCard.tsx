import { Card } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { cn } from "@/lib/utils";

interface ColorPaletteCardProps {
  id: string;
  name: string;
  colors: string[];
  selected?: boolean;
  onClick?: () => void;
}

const ColorPaletteCard = ({
  id,
  name,
  colors,
  selected = false,
  onClick,
}: ColorPaletteCardProps) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      className={cn(
        "style-card overflow-hidden transition-all duration-300",
        selected && "selected"
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex h-20 rounded-lg overflow-hidden">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 transition-transform duration-300 hover:scale-y-110"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">{name}</span>
          {selected && <CheckCircleFilled className="text-xl text-primary" />}
        </div>
      </div>
    </Card>
  );
};

export default ColorPaletteCard;
