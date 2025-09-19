"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "./button";

export const MotionButton = motion(
  // cast to any to avoid strict typing issues around VariantProps
  Button as unknown as React.ComponentType<any>
);

export default MotionButton;
