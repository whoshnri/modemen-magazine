import { getEventById } from "@/app/actions/cms/events";
import { notFound } from "next/navigation";
import EditEventClient from "./EditEventClient";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
        notFound();
    }

    return <EditEventClient event={event} />;
}
