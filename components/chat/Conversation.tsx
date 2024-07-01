import { Card, CardHeader } from '../ui/card'

type ConversationProps = {
  onClick: () => void;
  title: string;
};
const Conversation = ({ onClick, title }: ConversationProps) => {
  return (
    <Card onClick={onClick} className="w-full rounded-none">
      <CardHeader className="hover:bg-slate-200 cursor-pointer">
        {title}
      </CardHeader>
    </Card>
  )
}

export default Conversation
