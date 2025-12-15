import { getIssueById } from "@/app/actions/cms/issues";
import { notFound } from "next/navigation";
import EditIssueClient from "./EditIssueClient";

export default async function EditIssuePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const issue = await getIssueById(id);

    if (!issue) {
        notFound();
    }

    return <EditIssueClient issue={issue} />;
}
