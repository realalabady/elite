import { motion } from "framer-motion";
import { insurancePartners } from "@/data/insurance";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerContainer";

export const InsuranceGrid = () => {
  return (
    <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {insurancePartners.map((partner) => (
        <StaggerItem key={partner.id}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-card rounded-xl p-4 shadow-card hover:shadow-medium transition-all duration-300 flex items-center justify-center aspect-[3/2] border border-border/50"
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-bold text-lg">
                  {partner.name.charAt(0)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium line-clamp-2">
                {partner.name}
              </p>
            </div>
          </motion.div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
};
