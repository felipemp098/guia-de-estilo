import { Card, Tooltip } from "antd";
import { CheckCircleFilled, InfoCircleOutlined } from "@ant-design/icons";
import { cn } from "@/lib/utils";

interface StyleCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  selected?: boolean;
  onClick?: () => void;
  showTooltip?: boolean;
}

const StyleCard = ({
  id,
  name,
  description,
  image,
  selected = false,
  onClick,
  showTooltip = true,
}: StyleCardProps) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      className={cn(
        "style-card overflow-hidden transition-all duration-300",
        selected && "selected"
      )}
      cover={
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {selected && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <CheckCircleFilled className="text-4xl text-primary" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-card">{name}</h3>
              {showTooltip && (
                <Tooltip title={description} placement="top">
                  <InfoCircleOutlined className="text-card/80 text-lg cursor-help" />
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      }
      bodyStyle={{ display: "none" }}
    />
  );
};

export default StyleCard;
