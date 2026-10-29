import { Client } from "@hubspot/api-client";
import { FilterOperatorEnum } from "@hubspot/api-client/lib/codegen/crm/contacts";

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export const createHubspotContact = async (name: string, email: string, phone?: string) => {
    try {
        const nameParts = name.trim().split(" ");
        const firstname = nameParts[0] || "";
        const lastname = nameParts.slice(1).join(" ") || "";

        const properties: { [key: string]: string } = {
            email,
            firstname,
            lastname,
        };

        if (phone) {
            properties.phone = phone;
        }

        const SimplePublicObjectInput = { properties };
        const response = await hubspotClient.crm.contacts.basicApi.create(SimplePublicObjectInput);
        return response;
    } catch (error: any) {
        console.error("HUBSPOT SYNC ERROR:", error.body || error.message);
    }
};

export const createHubspotDeal = async (
    email: string,
    name: string,
    planName: string,
    amount: number
) => {
    try {
        let contactId: string;

        try {
            const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
                filterGroups: [
                    {
                        filters: [
                            {
                                propertyName: "email",
                                operator: FilterOperatorEnum.Eq,
                                value: email,
                            },
                        ],
                    },
                ],
                properties: ["email"],
                limit: 1,
                sorts: [],
            });

            if (searchResponse.results.length > 0) {
                contactId = searchResponse.results[0].id;
            } else {
                const newContact = await createHubspotContact(name, email);
                if (!newContact) throw new Error("Failed to create HubSpot contact");
                contactId = newContact.id;
            }
        } catch (err) {
            const newContact = await createHubspotContact(name, email);
            if (!newContact) throw err;
            contactId = newContact.id;
        }

        const dealResponse = await hubspotClient.crm.deals.basicApi.create({
            properties: {
                dealname: `${planName} - ${email}`,
                amount: amount.toString(),
                dealstage: "closedwon",
                pipeline: "default",
            },
        });

        const dealId = dealResponse.id;

        await hubspotClient.crm.associations.v4.basicApi.create(
            "deals",
            dealId,
            "contacts",
            contactId,
            [
                {
                    associationCategory: "HUBSPOT_DEFINED" as any,
                    associationTypeId: 3,
                },
            ]
        );

        return dealResponse;
    } catch (error: any) {
        console.error("HUBSPOT DEAL SYNC ERROR:", error.body || error.message);
    }
};

export const createHubspotSupportTicket = async (
    email: string,
    name: string,
    subject: string,
    message: string
) => {
    try {
        let contactId: string;

        try {
            const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
                filterGroups: [
                    {
                        filters: [
                            {
                                propertyName: "email",
                                operator: FilterOperatorEnum.Eq,
                                value: email,
                            },
                        ],
                    },
                ],
                properties: ["email"],
                limit: 1,
                sorts: [],
            });

            if (searchResponse.results.length > 0) {
                contactId = searchResponse.results[0].id;
            } else {
                const newContact = await createHubspotContact(name, email);
                if (!newContact) throw new Error("Failed to create HubSpot contact");
                contactId = newContact.id;
            }
        } catch (err) {
            const newContact = await createHubspotContact(name, email);
            if (!newContact) throw err;
            contactId = newContact.id;
        }

        const ticketResponse = await hubspotClient.crm.tickets.basicApi.create({
            properties: {
                subject: subject,
                content: message,
                hs_ticket_priority: "LOW",
                hs_pipeline: "0",
                hs_pipeline_stage: "1",
            },
        });

        const ticketId = ticketResponse.id;

        await hubspotClient.crm.associations.v4.basicApi.create(
            "tickets",
            ticketId,
            "contacts",
            contactId,
            [
                {
                    associationCategory: "HUBSPOT_DEFINED" as any,
                    associationTypeId: 15,
                },
            ]
        );

        return ticketResponse;
    } catch (error: any) {
        console.error("HUBSPOT TICKET SYNC ERROR:", error.body || error.message);
    }
};