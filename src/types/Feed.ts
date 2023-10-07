import type {Property} from "@/types/Property";

export type Feed = {
    mortgage: {
        amount: string,
        buyer: string
    },
    property: Property,
}