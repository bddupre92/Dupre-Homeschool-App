"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { BoardDetail } from '../../../components/Boards/BoardDetail';

export default function BoardDetailPage() {
  const params = useParams();
  const boardId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <BoardDetail boardId={boardId} />
    </div>
  );
}
