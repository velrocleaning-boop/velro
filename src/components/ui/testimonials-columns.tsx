"use client";
import React from "react";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TestimonialsColumn = (props: {
  testimonials: Testimonial[];
  duration?: number;
  className?: string;
}) => {
  const duration = props.duration || 15;
  return (
    <div className={props.className} style={{ flexShrink: 0, overflow: "hidden" }}>
      <div
        className="testimonial-scroll"
        style={{ animationDuration: `${duration}s`, display: "flex", flexDirection: "column", gap: "24px" }}
      >
        {[...props.testimonials, ...props.testimonials].map(({ text, image, name, role }, i) => (
          <div
            key={i}
            style={{
              padding: "32px",
              borderRadius: "24px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              width: "300px",
              backgroundColor: "#ffffff",
              fontSize: "0.95rem",
              lineHeight: 1.65,
              color: "#374151",
            }}
          >
            <div style={{ marginBottom: "20px" }}>{text}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={image}
                alt={name}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "1px solid #e5e7eb",
                }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111827", lineHeight: 1.3 }}>{name}</div>
                <div style={{ fontSize: "0.8rem", color: "#9ca3af", lineHeight: 1.3 }}>{role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
