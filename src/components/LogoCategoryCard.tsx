import { Card, Tooltip } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { cn } from "@/lib/utils";
import { LogoCategory, LogoOption } from "@/data/logoCategories";

interface LogoCategoryCardProps {
  category: LogoCategory;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
}

const LogoCategoryCard = ({
  category,
  selectedOptionId,
  onSelectOption,
}: LogoCategoryCardProps) => {
  return (
    <Card className="glass-card">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {category.title}
        </h3>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {category.options.map((option: LogoOption) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <div
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-2",
                isSelected
                  ? "border-primary shadow-lg scale-105"
                  : "border-border hover:border-primary/50 hover:shadow-md"
              )}
            >
              <img
                src={option.image}
                alt={option.alt}
                className="w-full h-full object-cover"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <CheckCircleFilled className="text-3xl text-primary" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircleFilled className="text-white text-sm" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default LogoCategoryCard;

