import getConversations from "../actions/getConversations"
import Sidebar from "../components/sidebar/Sidebar"
import ConversationList from "./components/ConversationList"

export default async function ConvesationsLayout({
    children
}: {
    children: React.ReactNode
}) {
    const conversations = await getConversations();

    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList initalItems={conversations}/>
                {children}
            </div>

        </Sidebar>
    )
};