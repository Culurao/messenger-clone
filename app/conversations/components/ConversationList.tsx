'use client';

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md"
import ConversationBox from "./ConversationBox";

interface ConversationListProps {
  initalItems: FullConversationType[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initalItems
}) => {
  const [items, setItems] = useState(initalItems);

  const router = useRouter();

  const { conversationId, isOpen } = useConversation();
  return (
    <aside className={clsx(`fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-gray-200 border-r`, isOpen ? 'hidden' : 'block w-full left-0')}>
      <div className="px-5">
        <div className="flex justify-between mb-4 pt-4">
          <div className="text-2xl font-bold text-neutral-800">
            Mensajitos
          </div>
          <div className="rounded-full p-2 bg-gray-100 text-gray-600 hover:opacity-75 transition cursor-pointer">
            <MdOutlineGroupAdd  size={20}/>
          </div>
        </div>
        {items.map((item) => (
          <ConversationBox key={item.id} data={item} selected={conversationId === item.id}/>
        ))}
      </div>
    </aside>
  );
}
export default ConversationList;