import MessageBox from '@/components/layout/Messagebox'
import AppSidebar from '@/components/layout/Sidebar'

export default function FeedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full flex">
            <AppSidebar />
            <div className="flex-1 border-x p-4 overflow-y-auto">{children}</div>
            <MessageBox />
        </div>
    )
}
