import { getInterviewById } from "@/app/actions/cms/interviews";
import { notFound } from "next/navigation";
import EditInterviewClient from "./EditInterviewClient";

export default async function EditInterviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const interview = await getInterviewById(id);

    if (!interview) {
        notFound();
    }

    return <EditInterviewClient interview={interview} />;
}
