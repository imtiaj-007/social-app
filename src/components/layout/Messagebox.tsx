import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function MessageBox() {
    return (
        <div className="w-80 flex flex-col border-l">
            <div className="border-b p-4">
                <h4 className="text-center">Messages</h4>
            </div>
            <div className="flex-1 space-y-4 p-4">
                <div className="bg-muted rounded-e-xl rounded-es-xl p-4">
                    <p className="text-sm">Hi there! How are you doing today?</p>
                    <span className="text-xs text-muted-foreground">2:30 PM</span>
                </div>
                <div className="bg-muted rounded-s-xl rounded-ee-xl p-4">
                    <p className="text-sm">I&apos;m doing great, thanks for asking!</p>
                    <span className="text-xs text-muted-foreground">2:32 PM</span>
                </div>
            </div>
            <div className="border-t p-4">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 text-sm"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="hover:bg-accent transition-all duration-200">
                        Send
                    </Button>
                </div>
            </div>
        </div>
    )
}
