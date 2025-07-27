"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function LoadingQuestion() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-5 w-20 bg-muted animate-pulse rounded" />
                <div className="h-5 w-16 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-2" />
              <div className="h-6 w-1/2 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 bg-muted animate-pulse rounded"
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <div className="h-10 w-[200px] bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 