import { NewsSummaryRequest } from '../types';
import { client } from '../api-client';

// ============================================================================
// Example 6: News Summary - Market News
// ============================================================================

/**
 * Example: Get recent news summaries
 */
export async function exampleNewsSummary(): Promise<void> {
    console.log('\n=== Example: News Summary ===\n');

    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 1); // Last 24 hours

    const request: NewsSummaryRequest = {
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
    };

    try {
        const response = await client.getNewsSummary(request, {
            page: 0,
            size: 5,
        });

        console.log(`Found ${response.totalElements} news summaries\n`);

        response.content.forEach((item) => {
            const date = new Date(item.timestamp).toLocaleString();
            console.log(`[${date}] ${item.title}`);
            console.log(`Source: ${item.sourceName}`);
            console.log(`Summary: ${item.content.substring(0, 150)}...`);
            console.log(`URL: ${item.url}`);
            console.log('');
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Find a specific news summary
 */
export async function exampleFindNewsSummary(): Promise<void> {
    console.log('\n=== Example: Find News Summary ===\n');

    try {
        // First, get a news summary to get valid IDs
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 7);

        const summaries = await client.getNewsSummary({
            fromDate: fromDate.toISOString(),
            toDate: toDate.toISOString(),
        }, { page: 0, size: 1 });

        if (summaries.content.length > 0) {
            const firstItem = summaries.content[0];

            // Now find the specific summary
            const summary = await client.findNewsSummary({
                MessageId: firstItem.messageId,
                SourceId: firstItem.sourceId,
            });

            console.log('Found news summary:');
            console.log(`Title: ${summary.title}`);
            console.log(`Source: ${summary.sourceName}`);
            console.log(`Content: ${summary.content}`);
            console.log(`URL: ${summary.url}`);
        } else {
            console.log('No news summaries found');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
