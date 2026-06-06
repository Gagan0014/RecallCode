import axios from 'axios';


export const getRecentSubmissions = async(username)=>{ 

    const query = `
    query getRecentSubmissionList($username: String!) {
        recentAcSubmissionList(username: $username) {
            id
            title
            titleSlug
            timestamp
        }
    }
    `;

    const response = await axios.post(
        "https://leetcode.com/graphql",
        {
            query,
            variables: {
                username
            }
        }
    );

    return response.data.data.recentAcSubmissionList;
}
