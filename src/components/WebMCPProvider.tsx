"use client";
import { useEffect } from 'react';

export default function WebMCPProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'modelContext' in navigator) {
      // @ts-ignore
      navigator.modelContext.provideContext({
        tools: [
          {
            name: "get_cleaning_price",
            description: "Get instant pricing for cleaning services in Riyadh based on district and service type.",
            inputSchema: {
              type: "object",
              properties: {
                district: { type: "string", description: "The district in Riyadh (e.g., Al Olaya, Hittin)" },
                serviceType: { type: "string", enum: ["Standard", "Deep Cleaning", "Move-in/out"] }
              },
              required: ["district", "serviceType"]
            },
            execute: async ({ district, serviceType }: { district: string, serviceType: string }) => {
              // Simulated pricing logic
              const price = serviceType === "Deep Cleaning" ? 250 : 150;
              return { price: `${price} SAR`, message: `The price for ${serviceType} in ${district} is ${price} SAR.` };
            }
          },
          {
            name: "book_cleaner",
            description: "Book a cleaning professional for a specific date and time.",
            inputSchema: {
              type: "object",
              properties: {
                date: { type: "string", format: "date" },
                time: { type: "string", description: "Desired time for cleaning" },
                address: { type: "string" }
              },
              required: ["date", "time", "address"]
            },
            execute: async (args: any) => {
              return { success: true, message: `Booking confirmed for ${args.date} at ${args.time}.` };
            }
          }
        ]
      });
    }
  }, []);

  return null;
}
